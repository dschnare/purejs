<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<!-- Root -->
	<xsl:template match="/">
		<!-- Show heading -->
		<h1>
			<xsl:attribute name="id"><xsl:value-of select="root/symbol/@name" /></xsl:attribute>
			<xsl:value-of select="root/symbol/@name"/>
		</h1>

		<!-- Show our own documentation -->
		<xsl:call-template name="symbol-docs" />

		<!-- Show our summary -->
		<xsl:copy-of select="root/symbol/summary" />

		<!-- Show our events -->
		<div class="events">
			<xsl:apply-templates select="root/symbol/events" />
		</div>

		<!-- Show our nested symbols -->
		<div class="symbols">
			<xsl:apply-templates select="root/symbol/symbols" />
		</div>
	</xsl:template>

	<!-- Nested Symbols -->
	<xsl:template match="symbol">
		<xsl:variable name="name" select="@name" />
		<xsl:variable name="summary" select="summary" />

		<!-- Show heading -->
		<h3>
			<xsl:attribute name="id"><xsl:value-of select="@name" /></xsl:attribute>
			<xsl:value-of select="@name"/>
		</h3>

		<!-- Show our own documentation -->
		<xsl:call-template name="symbol-docs" />

		<!-- If we don't have a summary then grab one from a symbol with the same name.,
			otherwise just use our own. -->
		<xsl:choose>
			<xsl:when test="string-length(summary) = 0">
				<xsl:for-each select="../symbol">
					<xsl:if test="@name = $name">
						<xsl:copy-of select="summary" />
					</xsl:if>
				</xsl:for-each>
			</xsl:when>
			<xsl:otherwise>
				<xsl:copy-of select="summary" />
			</xsl:otherwise>
		</xsl:choose>

		<!-- Show our events -->
		<div class="events">
			<xsl:apply-templates select="events/event" />
		</div>

		<!-- Show our nested symbols -->
		<div class="symbols">
			<xsl:apply-templates select="symbols/symbol" />
		</div>
	</xsl:template>

	<!-- Events -->
	<xsl:template match="event">
		<!-- TODO: Show an event -->
	</xsl:template>

	<!-- Show symbol documentation -->
	<xsl:template name="symbol-docs">
		<xsl:choose>
			<xsl:when test="@type = 'function' or @type = 'constructor'">
				<pre><code><xsl:call-template name="function-source" /></code></pre>
				<ul class="params">
					<xsl:apply-templates select="param" />
				</ul>
			</xsl:when>
		</xsl:choose>

		<!-- Show version -->
		<xsl:if test="@version != ''">
			<xsl:text>Version: </xsl:text><xsl:value-of select="@version" /><br/>
		</xsl:if>
		<!-- Show since -->
		<xsl:if test="@since != ''">
			<xsl:text>Since </xsl:text><xsl:value-of select="@since" /><br/>
		</xsl:if>
		<!-- Show compatibility -->
		<xsl:if test="count(compatibility) != 0">
			<table class="compatibility">
				<tr><th>Compatibility</th><th>Description</th></tr>
				<xsl:for-each select="compatibility">
					<tr><td><xsl:value-of select="@type" /></td><td><xsl:value-of select="normalize-space(.)" /></td></tr>
				</xsl:for-each>
			</table>
		</xsl:if>
	</xsl:template>

	<!-- Construct the source code for a function/constructor -->
	<xsl:template name="function-source">
		<xsl:text>function </xsl:text>
		<xsl:value-of select="@name" />
		<xsl:text>(</xsl:text>
		<xsl:for-each select="param">
			<xsl:value-of select="@name" />
			<xsl:if test="position() != last()">
				<xsl:text>, </xsl:text>
			</xsl:if>
		</xsl:for-each>
		<xsl:text>)</xsl:text>
	</xsl:template>

	<!-- Display a function parameter -->
	<xsl:template match="param">
		<li class="param">
			<xsl:value-of select="@name" />

			<!-- Show augments as [augment, augment] -->
			<xsl:if test="count(augment) != 0">
				<xsl:text> [</xsl:text>
				<xsl:for-each select="augment">
					<xsl:value-of select="text()" />
					<xsl:if test="position() != last()">
						<xsl:text>, </xsl:text>
					</xsl:if>
				</xsl:for-each>
				<xsl:text>] </xsl:text>
			</xsl:if>

			<xsl:text> {</xsl:text><xsl:value-of select="@prototype" /><xsl:text>} - </xsl:text>

			<xsl:value-of select="normalize-space(summary)" />
		</li>
	</xsl:template>
</xsl:stylesheet>